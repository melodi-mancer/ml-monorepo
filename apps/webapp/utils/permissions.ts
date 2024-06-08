const admins = ['gsotero@gmail.com', 'jakejonesmail@gmail.com', 'martin.baere@gmail.com', 'samuelvankiel@gmail.com']

export const isAdmin = (email: string): boolean => {
  return admins.includes(email)
}