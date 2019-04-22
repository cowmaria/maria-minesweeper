import * as localforage from "localforage";

export function getNumberOfEntries(CC) {
    return localforage.getItem(CC)
}
export function setNumberOfEntries(CC,parts) {

    localforage.setItem(CC, parts);
}

export function getAllCCforCCkey(key) {
  return  localforage.getItem(key);
}
export function saveCCGroup(key,CCgroup) {
    localforage.setItem(key, CCgroup);
}


export async function clearStorage() {
  await localforage.clear();
    sessionStorage.clear();
}