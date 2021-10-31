import React from 'react';

import ProfileComponent from '../components/ProfileComponent';

const SellerProfileScreen = (props) => {

    const { user } = props.route.params;

    return (
        <ProfileComponent user={user} navigation={props.navigation} />
    );

}

export default SellerProfileScreen;