import "./styles.css";

const spinner = document.createElement("div");
spinner.id = "spinner";

const preloader = document.createElement("div");
preloader.id = "loader";
preloader.innerText = "Loading";
preloader.append(spinner);

export default preloader;
