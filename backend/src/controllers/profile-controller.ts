import { Request, Response } from "express";
import { db } from "../db/conn";
import { createUserToken } from "../utils/create-user-token";
import bcrypt from "bcrypt";
import fs from "fs";
import { supabaseClient } from "../utils/supabaseClient";
import { uploadToSupabase } from "../utils/upload-to-supabase";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const CreateProfile = async (req: Request, res: Response) => {
  const { name, surname, email, password, username } = req.body;
  let photo = "";

  if (req.file) {
    photo = await uploadToSupabase(req.file);
  }

  try {
    const queryEmail = `SELECT email FROM users WHERE email = $1`;
    const valuesEmail = [email];
    const {rows: emailExists} = await db.query(queryEmail, valuesEmail);

    if (emailExists.length > 0) {  
      throw new Error ("O email que você utilizou já está cadastrado");
    }

    const queryUsername = `SELECT username FROM users WHERE username = $1`;
    const valuesUsername = [username];
    const {rows: usernameExists} = await db.query(queryUsername, valuesUsername);

    if (usernameExists.length > 0) {
      throw new Error("O nome de usuário já está em uso");
    }

    //hash the password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const queryCreateProfile = `INSERT INTO users (photo, name, surname, email, password, username, user_default_coin) 
    VALUES ($1, $2, $3, $4, $5, $6, (SELECT id FROM coins WHERE code = 'BRL')) RETURNING id`;
    
    const valuesCreateProfile = [photo, name, surname, email, passwordHash, username];

    const {rows: newUser} = await db.query(queryCreateProfile, valuesCreateProfile);

    await createUserToken(newUser[0], req, res);
  } catch (err: unknown) {
    console.error(err);
    const message = (err instanceof Error && err.message) || "Erro inesperado";
    return res.status(422).json({ message: message });
  }
};

/**
 * username can be username or email
 */
export const SignIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(422)
      .json({ message: "Usuário ou email são obrigatórios" });
  }

  if (!password) {
    return res.status(422).json({ message: "A senha é obrigatória" });
  }

  const querySignIn = `SELECT id, password FROM users WHERE username = $1 OR email = $1 LIMIT 1`;

  const valuesSignIn = [username];

  const {rows} = await db.query(querySignIn, valuesSignIn);
  const user = rows[0];

  if (!user) {
    return res.status(422).json({ message: "Usuário não existe" });
  }

  //check password
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ message: "Senha inválida" });
  }

  await createUserToken(user, req, res);
};

export const getAvatar = async (req: Request, res: Response) => {
  const user = req.user;

  try {
    const queryAvatar = `SELECT name, surname, photo FROM users WHERE id = $1`;
    
    const valuesAvatar = [user];

    const {rows: avatar} = await db.query(queryAvatar, valuesAvatar);

    if(avatar[0].photo !== ""){
      const supabase = supabaseClient();
  
      const {data, error} = await supabase.storage.from(process.env.SUPABASE_BUCKET!).createSignedUrl(`/assets/uploads/${avatar[0].photo}`, 60);
  
      if(error){
        throw error;
      }

      avatar[0].photo = data.signedUrl;
    }
    return res.status(200).json(avatar[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao buscar avatar" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const user = req.user;

  try {
    const queryGetUserProfile = `SELECT photo, name, surname, email, username FROM users WHERE id = $1`;
    
    const valuesGetUserProfile = [user];

    const {rows: profile} = await db.query(queryGetUserProfile, valuesGetUserProfile);

    return res.status(200).json(profile[0]);
  } catch (err) {
    console.log(err);
  }
};

export const EditUserProfile = async (req: Request, res: Response) => {
  const user = req.user;
  const { name, surname, username, email } = req.body;
  let photo = "";
  
  
  if (req.file) {
    photo = await uploadToSupabase(req.file);
  }

  try {
    const queryEmail = `SELECT email FROM users WHERE email = $1 AND id != $2`;
    const valuesEmail = [email, user];
    const {rows: emailExists} = await db.query(queryEmail, valuesEmail);

    if (emailExists.length > 0) {  
      throw new Error ("O email que você utilizou já está cadastrado");
    }

    const queryUsername = `SELECT username FROM users WHERE username = $1 AND id != $2`;
    const valuesUsername = [username, user];
    const {rows: usernameExists} = await db.query(queryUsername, valuesUsername);

    if (usernameExists.length > 0) {
      throw new Error("O nome de usuário já está em uso");
    }

    const queryOldPhotName = `SELECT photo FROM users WHERE id = $1`;
    const valuesOldPhotoName = [user];
    const {rows: oldPhotoName} = await db.query(queryOldPhotName, valuesOldPhotoName);

    const deleteOldPhoto = async (oldPhotoFilename: string) => {
      if (oldPhotoFilename !== "") {
        try{
          const supabase = supabaseClient();
          const {error} = await supabase.storage.from(process.env.SUPABASE_BUCKET!).remove([`assets/uploads/${oldPhotoFilename}`]);

          if(error){
            throw error;
          }

        }catch(err){
          console.error(err);
          return "";
        }
      }
    }

    const fieldsToUpdate = {
      photo: photo !== "" ? photo : undefined,
      name: name ? name : undefined,
      surname: surname ? surname : undefined,
      email: email ? email : undefined,
      username: username ? username : undefined,
    };

    // cleanup of undefined key:values pairs
    const filteredFields = Object.fromEntries(Object.entries(fieldsToUpdate).filter(([_,value]) => value !== undefined));

    const setClause = Object.keys(filteredFields).map((key, index) => `${key} = $${index + 1}`).join(", ");

    const queryEditUserProfile = `UPDATE users SET ${setClause} WHERE id = $${Object.keys(filteredFields).length + 1} RETURNING *`;

    const valuesEditUserProfile = [...Object.values(filteredFields), user];

    const {rows: updatedProfile} = await db.query(queryEditUserProfile, valuesEditUserProfile);

    deleteOldPhoto(oldPhotoName[0].photo);


    return res.status(200).json(updatedProfile);
  } catch (err) {
    console.error(err);
    const message = (err instanceof Error && err.message) || "Erro inesperado";
    return res.status(422).json({ message: message });
  }
};

export const ChangePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;

  try {
    const queryOldPassword = `SELECT password FROM users WHERE id = $1`;
    const valuesOldPassword = [user];

    const {rows: checkOldPassword} = await db.query(queryOldPassword, valuesOldPassword);

    //check password
    const checkPassword = await bcrypt.compare(
      oldPassword,
      checkOldPassword[0].password
    );

    if (!checkPassword) {
      throw new Error("Senha atual inválida, não podemos salvar a senha nova");
    }

    //hash the password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const queryChangePassword = `UPDATE users SET password = $1 WHERE id = $2`;
    const valuesChangePassword = [passwordHash, user];

    await db.query(queryChangePassword, valuesChangePassword);

    return res.status(200).json({message: "Senha atualizada!"});
  } catch (err) {
    console.error(err);
    const message = (err instanceof Error && err.message) || "Erro inesperado";
    return res.status(422).json({ message: message });
  }
};
