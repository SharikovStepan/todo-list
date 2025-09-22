import Button from "./Button";

function LogIn() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("LOGIN");
  };

  return (
    <>
      <form action="#" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <div className="flex flex-col">
            <label htmlFor="email">Email:</label>
            <div className="border grow border-secondary rounded-sm">
              <input id="email" name="email" className="input" type="text" />
            </div>
          </div>
			 <div className="flex flex-col">
            <label htmlFor="password">Password:</label>
            <div className="border grow border-secondary rounded-sm">
              <input id="password" name="password" className="input" type="password" />
            </div>
          </div>

          <Button type="submit" className={["bg-primary", "hover:bg-secondary", "h-8", "w-full", "sm:w-20", "text-xs", "px-1", " text-zinc-800"]}>
            Регистрация
          </Button>
        </div>
      </form>
    </>
  );
}
export default LogIn;
