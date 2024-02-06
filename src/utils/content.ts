const content = {
  GENERIC: {
    ABI: 'Fetching ABI...',
    CONNECTING: 'Connecting Wallet...',
    SIGNING: 'Signing...',
    TOGGLING: 'Toggling...',
    UPDATING: 'Updating Profile details...',
    UPDATED: 'Profile details updated successfully.',
    COPY: 'Copied Successfully...',
  },
  SMART_CONTRACT: {
    CREATING: 'Creating Smart Contract',
    WHITELIST_EDIT: 'Whitelist edited successfully',
    CREATED: 'Smart Contract created successfully',
    FAILED: 'Failed to Update or Create',
  },
  INITIALISATION: 'Initializing Arcana Auth SDK...',
  KEYSPACE: {
    SAVED: 'Saving keyspace preference...',
    SUCCESS: 'Keyspace preference saved successfully.',
  },
  VERIFICATION: {
    FORM_SUBMIT: 'Submitting the form for verification...',
    FORM_SUCCESS: 'Form submitted successfully.',
  },
  IAM: {
    SAVING_INFO: 'Saving IAM Auth Credentials...',
    SUCCESS: 'IAM Auth Credentials saved successfully.',
  },
  SOCIAL_AUTH: {
    SAVING: 'Saving social auth credentials...',
    SUCCESS: 'Social auth credentials saved successfully.',
  },

  WALLET: {
    SAVING: 'Saving wallet config...',
    SUCCESS: 'Wallet Configurations saved successfully.',
    THEME: {
      SAVING: 'Saving wallet theme...',
      SUCCESS: 'Wallet theme saved successfully.',
    },
  },
  APP: {
    DELETE_APP: {
      DELETING: 'Deleting the app...',
      SUCCESS: 'App deleted successfully.',
    },
    APP_NAME: {
      SAVING: 'Saving app name...',
      SUCCESS: 'App name saved successfully.',
    },
    APP_DETAILS: {
      FETCH_CONFIG: 'Fetching app config...',
      CREATING: 'Creating app...',
    },
    LOGIN: {
      CLICK: 'Click on the login link sent to your email address',
      FETCHING: 'Fetching User Info...',
    },
  },
  USER_LIMITS: {
    SAVING: 'Saving user limits...',
    SUCCESS: 'User limits saved successfully.',
    SAVING_BLOCKCHAIN: 'Saving user limits in smart contract...',
    SAVING_BLOCKCHAIN_SUCCESS: 'User limits saved in blockchain.',
  },
  GAS_TANK: {
    ADDED: 'Gas tank added successfully',
    SETUP: 'Setting up gas tank...',
    SETUP_COMPLETE: 'Gas tank setup complete',
  },
  INVOICES: {
    FETCHING: 'Fetching invoices...',
  },
  BILLING: {
    DETAILS: {
      ADDRESS: 'Address line 1 is required',
      CITY: 'City is required',
      STATE: 'State is required',
      ZIP: 'Zip code is required',
      INVALID_ZIP: 'Invalid Zip code',
      COUNTRY: 'Country is required',
      SAVING: 'Saving billing address...',
      SAVED: 'Billing Address saved successfully.',
    },
    CARD: {
      NAME_INCOMPLETE: 'Your Card Name is incomplete',
      ENTER_ADDRESS: 'Enter the billing address to continue',
      SAVE_PLEASE: 'Save the billing address to continue',
      ADDING: 'Adding card...',
      SAVED: 'Card added successfully.',
      DELETE: 'Deleting card...',
    },
  },
  REDIRECT_URI: {
    COPIED: 'Copied Redirect URI to clipboard',
  },
}
const errors = {
  GENERIC: {
    ABI: 'Error occurred while fetching ABI.',
    ERROR: 'Eh! You ran into an Error.Please try again or contact support!',
    WAIT: 'Please wait',
    SOMETHING_WENT_WRONG:
      'Something went wrong. Please try again or contact support!',
    COPY: 'Unable to copy. Please try again or contact support.',
  },
  GLOBAL_KEYSPACE_ERROR:
    'Login providers are disabled as you have chosen Global keys',
  KEYSPACE_ERROR:
    'Error occurred while saving keyspace. Try again or contact support!',
  FORM: {
    SUBMIT:
      'Error occurred while submitting the form. Try again or contact support!',
    COMPANY_NAME: 'Company name is required.',
    PROJECT_NAME: 'Project name is required.',
    COMPANY_LOCATION: 'Company location is required.',
    CONTACT_NAME: 'Contact name is required.',
    CONTACT_EMAIL: 'Contact email is required.',
    VALID_MAIL: 'Invalid Contact Email! Please enter a valid email address.',
    URL: 'Website or app url is required',
    DESCRIPTION: 'A short project description is required',
    DESCRIPTION_LENGTH: 'Project Description should be less than 160 words',
  },

  IAM: {
    ERROR: 'Error occured while saving the IAM auth credentials.',
  },
  SOCIAL_AUTH: {
    ERROR: 'Error occured while saving the social auth.',
  },
  WALLET: {
    ERROR: 'Error occured while saving the wallet configurations.',
    THEME: {
      ERROR: 'Error occured while saving the wallet theme.',
    },
  },
  APP: {
    DELETE_APP: {
      ERROR:
        'Unable to delete the app at the moment. Please try again or contact support',
    },
    APP_NAME: {
      ERROR: 'Error occurred while saving the app name.',
    },
    APP_DETAILS: {
      ERROR_CREATING: 'Error occured while creating mainnet app.',
      ERROR_CREATING_MAINNET: 'Error occured while creating mainnet app.',
    },
  },
  USER_LIMITS: {
    ERROR: 'Error occurred while saving the user limits.',
  },
  INVOICES: {
    CARD_ERROR: 'No Card Added.',
  },
  REDIRECT_URI: {
    ERROR: 'Unable to copy. Please try again or contact support.',
  },
  CHAIN_MANAGEMENT: {
    DEFAULT: "Can't delete Default chain",
    ENABLE: 'Please enable the chain and try again',
  },
}
export { errors, content }
