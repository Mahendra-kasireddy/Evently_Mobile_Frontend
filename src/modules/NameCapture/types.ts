/** Subset of GET /user/getUserDetails' response this module actually reads. */
export interface UserNameStatusDTO {
  name?: string;
}

/** Subset of PATCH /user/updateProfile's response this module actually reads. */
export interface UpdateNameResponseDTO {
  name: string;
}
