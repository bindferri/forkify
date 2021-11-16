import {TIMEOUT_SEC} from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAX = async function(url,uploadData = undefined){
    try{
    const api = uploadData ? fetch(url,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData)}) : fetch(url)

    const apiFetch = await Promise.race([api,timeout(TIMEOUT_SEC)]);
    const apiJson = await apiFetch.json();
    if (!apiFetch.ok) throw new Error(`${apiJson.message} (${apiFetch.status})`)
    return apiJson
}catch (e){
    throw e
}
}
//
// export const getJson = async function(url){
//     try{
//         const apiFetch = await Promise.race([fetch(url),timeout(TIMEOUT_SEC)]);
//         const apiJson = await apiFetch.json();
//         if (!apiFetch.ok) throw new Error(`${apiJson.message} (${apiFetch.status})`)
//         return apiJson
//     }catch (e){
//         throw e
//     }
// }
// export const sendJson = async function(url,data){
//     try{
//         const apiFetch = await Promise.race([fetch(url,{
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data)
//         }),timeout(TIMEOUT_SEC)]);
//         const apiJson = await apiFetch.json();
//         if (!apiFetch.ok) throw new Error(`${apiJson.message} (${apiFetch.status})`)
//         return apiJson
//     }catch (e){
//         throw e
//     }
// }

