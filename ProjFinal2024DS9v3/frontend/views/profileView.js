// views/profileView.js
import { validateForm } from '../utils/formValidation.js';

export const ProfileView = {
  init(controller) {
    this.controller = controller;
    this.cacheDom();
    this.bindEvents();
    this.loadUserProfile();
  },

  cacheDom() {
    this.form = document.getElementById("profileForm");
    this.photoInput = document.getElementById("photoInput");
    this.photoPreview = document.getElementById("photoPreview");
    this.chooseImageBtn = document.getElementById("chooseImage");
    this.removeImageBtn = document.getElementById("removeImage");
    this.saveButton = document.getElementById("saveButton");
    this.cancelButton = document.getElementById("cancelButton");
  },

  bindEvents() {
    this.chooseImageBtn.addEventListener("click", this.onChooseImage.bind(this));
    this.removeImageBtn.addEventListener("click", this.onRemoveImage.bind(this));
    this.photoInput.addEventListener("change", this.onPhotoSelected.bind(this));
    this.form.addEventListener("submit", this.onSubmitForm.bind(this));
    this.cancelButton.addEventListener("click", this.onCancel.bind(this));
  },

  onChooseImage() {
    this.photoInput.click();
  },

  onRemoveImage() {
    this.photoPreview.src = "placeholder-image.png";
    this.photoInput.value = "";
  },

  onPhotoSelected(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  },

  async onSubmitForm(event) {
    event.preventDefault();
    if (validateForm(this.form)) {
      try {
        console.log('this.form de onSubmitForm ', this.form);
        //const formData = new FormData(this.form);
        const formData = new FormData();
        
        Array.from(this.form.elements).forEach(element => {
        if (element.name && !element.disabled) {
            formData.append(element.name, element.value);
            console.log(`Elemento agregado: ${element.name} = ${element.value}`);
        }
        });

        console.log('par de valores en formdata')
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }


        console.log('formData de onSubmitForm ', formData);
        if (this.photoInput.files[0]) {
          formData.append('photo', this.photoInput.files[0]);
        }
        // como enviar formData a this.controller.updateUserProfile
        //const response = await this.controller.updateUserProfile(formData);
        await this.controller.updateUserProfile(formData);
        alert('Profile updated successfully');
      } catch (error) {
        alert('Failed to update profile: ' + error.message);
      }
    }
  },

  onCancel() {
    window.history.back();
  },

  async loadUserProfile() {
    try {
      const profile = await this.controller.getUserProfile();
      //this.populateForm(profile);
      if (profile){
        this.populateForm(profile);
      } else {
        console.error('Profile data is undefined');
      }
    } catch (error) {
      alert('Failed to load user profile: ' + error.message);
    }
  },

  populateForm(profile) {
    for (let key in profile) {
      if (this.form[key]) {
        this.form[key].value = profile[key];
      }
    }
    // Cargar los valores de los familiares en el formulario
    if (profile.familiares && profile.familiares.length > 0) {
      const familiar = profile.familiares[0]; // Asumiendo que solo hay un familiar por ahora
      for (let key in familiar) {
        if (this.form[key]) {
          this.form[key].value = familiar[key];
        }
      }
    }
    if (profile.photoUrl) {
      this.photoPreview.src = profile.photoUrl;
    }
  }
};