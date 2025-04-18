export class UsersTable {
  public static users: any = [
    {
      id: 1,
      username: 'admin',
      password: 'demo',
      email: 'admin@demo.com',
      authToken: 'auth-token-8f3ae836da744329a6f93bf20594b5cc',
      refreshToken: 'auth-token-f8c137a2c98743f48b643e71161d90aa',
      roles: [1], // Administrator
      pic: './assets/media/avatars/300-1.jpg',
      fullname: 'Sean S',
      firstname: 'Sean',
      lastname: 'Stark',
      occupation: 'CEO',
      companyName: 'Keenthemes',
      phone: '456669067890',
      language: 'en',
      timeZone: 'International Date Line West',
      website: 'https://keenthemes.com',
      communication: {
        email: true,
        sms: true,
        phone: false,
      },
      address: {
        addressLine: 'L-12-20 Vertex, Cybersquare',
        city: 'San Francisco',
        state: 'California',
        postCode: '45000',
      },
      socialNetworks: {
        linkedIn: 'https://linkedin.com/admin',
        facebook: 'https://facebook.com/admin',
        twitter: 'https://twitter.com/admin',
        instagram: 'https://instagram.com/admin',
      },
    },
    {
      id: 2,
      username: 'user',
      password: 'demo',
      email: 'user@demo.com',
      authToken: 'auth-token-6829bba69dd3421d8762-991e9e806dbf',
      refreshToken: 'auth-token-f8e4c61a318e4d618b6c199ef96b9e55',
      roles: [2], // Manager
      pic: './assets/media/avatars/300-6.jpg',
      fullname: 'Megan F',
      firstname: 'Megan',
      lastname: 'Fox',
      occupation: 'Deputy Head of Keenthemes in New York office',
      companyName: 'Keenthemes',
      phone: '456669067891',
      language: 'en',
      timeZone: 'International Date Line West',
      communication: {
        email: true,
        sms: true,
        phone: false,
      },
      address: {
        addressLine: '3487  Ingram Road',
        city: 'Greensboro',
        state: 'North Carolina',
        postCode: '27409',
      },
      socialNetworks: {
        linkedIn: 'https://linkedin.com/user',
        facebook: 'https://facebook.com/user',
        twitter: 'https://twitter.com/user',
        instagram: 'https://instagram.com/user',
      },
    },
    
  ];

  public static tokens: any = [
    {
      id: 1,
      authToken: 'auth-token-' + Math.random(),
      refreshToken: 'auth-token-' + Math.random(),
    },
  ];
}
