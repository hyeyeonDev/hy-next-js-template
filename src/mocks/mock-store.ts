import { mockContents } from "./content.mock";
import { mockContentComments } from "./content-comments.mock";
import { mockDataCodes } from "./data-codes.mock";
import { mockDigitalMapLocations } from "./digital-map.mock";
import { mockLoginHistory } from "./login-history.mock";
import { mockOrganizations } from "./organizations.mock";
import { mockUsers } from "./users.mock";

export const mockStore = {
  users: [...mockUsers],
  organizations: [...mockOrganizations],
  loginHistory: [...mockLoginHistory],
  dataCodes: [...mockDataCodes],
  digitalMapLocations: [...mockDigitalMapLocations],
  contents: [...mockContents],
  comments: [...mockContentComments],
  currentUser: mockUsers[0],
};
