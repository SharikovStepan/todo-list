import { useReducer } from "react";
import Button from "./Button";
const initialState = { email: "", password: "", repeatPassword: "" };

const reducer = (state, action) => {
  switch (action.type) {
    case "email":
      return { ...state, email: action.value };
    case "password":
      return { ...state, password: action.value };
    case "repeatPassword":
      return { ...state, repeatPassword: action.value };
  }
};

function SingUp({ registration }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = state.email;
    const password = state.password;
    const repeatPassword = state.repeatPassword;
    registration(email, password, repeatPassword);
  };

  return (
    <>
      <form className="flex flex-col flex-1 justify-center items-center gap-2" action="#" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="email">Email:</label>
          <div className="border grow border-secondary rounded-sm">
            <input id="email" name="email" className="input" type="text" onChange={(e) => dispatch({ type: "email", value: e.target.value })} />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password:</label>
          <div className="border grow border-secondary rounded-sm">
            <input id="password" name="password" className="input" type="password" onChange={(e) => dispatch({ type: "password", value: e.target.value })} />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Repeat password:</label>
          <div className="border grow border-secondary rounded-sm">
            <input id="password" name="password" className="input" type="password" onChange={(e) => dispatch({ type: "repeatPassword", value: e.target.value })} />
          </div>
        </div>

        <Button type="submit" className={["bg-primary", "hover:bg-secondary", "h-8", "w-full", "sm:w-20", "text-xs", "px-1", " text-zinc-800"]}>
          Регистрация
        </Button>
      </form>
    </>
  );
}
export default SingUp;
