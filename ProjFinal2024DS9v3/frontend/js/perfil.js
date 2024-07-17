// perfil.js
import config from '..//config.js';

import { ProfileView } from '..//views/profileView.js';
import * as profileController from '..//controllers/profileController.js';
//

(() => {
  ProfileView.init(profileController);
})();

