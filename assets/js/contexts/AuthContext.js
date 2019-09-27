import React from 'react';

export default React.createContext({
    IsAuthenticated: false,
    SetIsAuthenticated: (value) => {}
});