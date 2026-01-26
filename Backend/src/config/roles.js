import { PERMISSIONS } from "./permissions.js";

export const ROLES = {
    admin: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_CREATE,
        PERMISSIONS.USER_DELETE,
        PERMISSIONS.PROFILE_READ,
        PERMISSIONS.PROFILE_UPDATE
    ],

    user: [
        PERMISSIONS.PROFILE_READ,
        PERMISSIONS.PROFILE_UPDATE,
    ]
}