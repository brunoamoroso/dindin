import Cookies from "js-cookie";

export function signOut(){
    Cookies.remove('token');
    window.location.reload();
}