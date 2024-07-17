// controllers/profileController.js
import config from '../config.js';
//

export const getUserProfile = async (req, res) => {
  try {

    console.log('formData recibido en el controlador:');

    console.log('Fetching from:', `${config.API_BASE_URL}/api/users/profile`);
    console.log('Auth Token:', localStorage.getItem('authToken'));

    const response = await fetch(`${config.API_BASE_URL}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    console.log('Response:', response);

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const profile = await response.json();
    console.log('profile del get user profile');
    console.log('Data received:',profile);
    console.log('Tipo de profile:', typeof profile);
    console.log('Contenido de profile:', JSON.stringify(profile, null, 2));
    const jsonprofile = JSON.stringify(profile, null, 2)
    return profile;
    //res(jsonprofile);
    //res.json(jsonprofile);
  } catch (error) {
    console.error('Error loading user profile:', error);
    res.status(500).json({ message: 'Failed to load user profile' });
  }
};


export const updateUserProfile = async (formData) => {
      console.log('formData recibido en el controlador:', formData);
      // Crear un nuevo objeto FormData y append los datos
      const updatedFormData = new FormData();
      for (let [key, value] of formData.entries()) {
        updatedFormData.append(key, value);
      }
      console.log('updatedFormData en el controlador:', updatedFormData);
      const response = await fetch(`${config.API_BASE_URL}/api/users/profileUpdate`, {
        method: 'POST',
        body: updatedFormData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(`Failed to update profile not ok: ${errorText}`);
        console.log("not ok response", errorText);

        //throw new Error('Failed to update profile not ok');
      }

      const result = await response.json();

      console.log('Data result:', result);
      return result;
  };


  //bak
  // export const updateUserProfile = async (formData) => {
  //   try {
  //     console.log('formData recibido en el controlador:', formData);
  
  //     // Crear un nuevo objeto FormData y append los datos
  //     const updatedFormData = new FormData();
  //     for (let [key, value] of formData.entries()) {
  //       updatedFormData.append(key, value);
  //     }
  
  //     // Si hay un archivo de foto, agregarlo al FormData
  //   //   if (formData.get('photo')) {
  //   //     updatedFormData.append('photo', formData.get('photo'));
  //   //   }
  
  //     console.log('updatedFormData en el controlador:', updatedFormData);
  
  //     const response = await fetch(`${config.API_BASE_URL}/api/users/profileUpdate`, {
  //       method: 'POST',
  //       body: updatedFormData,
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  //       }
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to update profile');
  //     }
  
  //     const result = await response.json();
  
  //     console.log('Data result:', result);
  
  //     return result;
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     throw error;
  //   }
  // };