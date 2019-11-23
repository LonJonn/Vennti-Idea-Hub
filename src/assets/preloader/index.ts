import "./styles.css";

const spinner = document.createElement("div");
spinner.id = "spinner";

const preloader = document.createElement("div");
preloader.id = "logo";
preloader.innerText = "Venntiboard";
preloader.append(spinner);

export default preloader;
