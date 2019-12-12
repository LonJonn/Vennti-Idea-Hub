import Vue from "vue";
import Vuetify from "vuetify/lib";

import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		dark: false,
		themes: {
			light: {
				primary: "#ff7043",
				"primary-light": "#ffa270",
				"primary-dark": "#c63f17",
				secondary: "#ff8a80",
				"secondary-light": "#ffbcaf",
				"secondary-dark": "#c85a54"
			},
			dark: {
				primary: "#ff7043",
				"primary-light": "#ffa270",
				"primary-dark": "#c63f17",
				secondary: "#ff8a80",
				"secondary-light": "#ffbcaf",
				"secondary-dark": "#c85a54"
			}
		}
	}
});
