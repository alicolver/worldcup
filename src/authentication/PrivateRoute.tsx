import { Redirect, Route } from "react-router-dom";

function PrivateRoute({
  children,
  token,
  ...rest
}: {
  children: JSX.Element;
  token: string;
}) {
  return (
    <Route
      {...rest}
      render={() => {
        return token ? children : <Redirect to="/" />;
      }}
    />
  );
}
export default PrivateRoute;
