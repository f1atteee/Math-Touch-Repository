//export const AUTH_API = "http://localhost:8081";
export const AUTH_API = "https://localhost:7007";
export const GENERAL_API = "http://localhost:8082";
//export const TESTING_API = "http://localhost:8084";
export const TESTING_API = "https://localhost:7010";
export const CONTACT_API = "http://localhost:8083";
export const NOTES_API = "http://localhost:8085";

// Auth/User
export const USER_LOGIN_URL = `${AUTH_API}/api/User/Login`;
export const USER_CREATE_URL = `${AUTH_API}/api/User/Create`;
export const USER_GET_BY_ID_URL = (id: string | number) => `${AUTH_API}/api/User/GetById?id=${encodeURIComponent(String(id))}`;
export const USER_UPDATE_URL = `${AUTH_API}/api/User/Update`;

// General data (algebra/geometry/sections/images/thems)
export const SECTION_GET_BY_TYPE_URL = `${GENERAL_API}/api/Section/GetSectionByTypeMath`;
export const ALGEBRA_GET_BY_ID_URL = `${GENERAL_API}/api/Algebra/GetAlgebraDataById`;
export const GEOMETRY_GET_BY_ID_URL = `${GENERAL_API}/api/Geometry/GetGeometryDataById`;
export const IMAGES_GET_FOR_THEM_URL = `${GENERAL_API}/api/Image/GetImagesForThem`;
export const THEMS_GET_BY_IDS_FOR_TYPE_URL = `${GENERAL_API}/api/Thems/GetThemsByIdsForTypeMath`;

// Testing service
export const QUESTIONS_BASE_URL = `${TESTING_API}/api/questions`;
export const TESTING_START_URL = `${TESTING_API}/api/testing/start`;
export const TESTING_SUBMIT_URL = `${TESTING_API}/api/testing/submit`;
export const TESTING_HISTORY_URL = `${TESTING_API}/api/testing/history`;

// Contact
export const CONTACT_SEND_URL = `${CONTACT_API}/api/Contact/send`;

// Notes
export const USER_NOTES_URL = `${NOTES_API}/api/notes`;
export const USER_NOTES_BY_DATE_URL = (date: string) => `${NOTES_API}/api/notes/${date}`;
export const NOTE_BY_ID_URL = (id: number) => `${NOTES_API}/api/notes/${id}`;