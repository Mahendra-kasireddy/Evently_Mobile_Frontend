/** Subset of GET /user/getUserDetails' response this module actually reads. */
export interface UserNameStatusDTO {
  id?: string;
  name?: string;
  photoUrl?: string;
}

/** Subset of PATCH /user/updateProfile's response this module actually reads. */
export interface UpdateNameResponseDTO {
  name: string;
  photoUrl?: string;
}

/** What the profile step saves: both are required. */
export interface ProfileBasics {
  name: string;
  photoUrl: string;
}

/** A photo picked on the device, before it is uploaded. */
export interface PickedPhoto {
  uri: string;
  name: string;
  type: string;
}

export type PhotoSource = 'camera' | 'library';
