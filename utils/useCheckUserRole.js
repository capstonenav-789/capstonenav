import { useSelector } from 'react-redux';

const useCheckUserRole = (roles) => {
  const userData = useSelector((state) => state.home);

  const checkUserRoles = () => {
    if (!userData) {
      return roles.reduce((acc, role) => {
        acc[role] = false;
        return acc;
      }, {});
    }

    return roles.reduce((acc, role) => {
      acc[role] = userData.role === role;
      return acc;
    }, {});
  };

  return checkUserRoles();
};

export default useCheckUserRole;