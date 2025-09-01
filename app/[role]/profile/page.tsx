import ProfilePage from '@/app/components/profile/profile';
import { getProfile } from '@/app/lib/api/merchant/profile';
import React from 'react'

const page = async () => {

  const { data: profileData } = await getProfile();
  console.log(profileData);


  return (
    <ProfilePage data={profileData} />
  )
}

export default page