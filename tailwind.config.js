module.exports = {
	theme: {
		container: {
			center: true,
			padding: "2rem"
		},
		extend: {
			boxShadow: {
				// lg:
				// 	"0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
				xl: "0 10px 20px 0 rgba(0,13,36,.16), 0 2px 8px 0 rgba(0,13,36,.08)",
				inner: "inset 0 0 12px rgba(0,0,0,.3)",
				full: "0 2px 16px rgba(0, 0, 0, 0.15)",
				lifted: "0 7px 14px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.08)"
			},
			borderRadius: {
				md: "0.375rem",
				xl: "0.8rem"
			}
		}
	},
	variants: {
		backgroundColor: ["responsive", "hover", "focus", "disabled"],
		cursor: ["responsive", "hover", "focus", "disabled"]
	},
	plugins: []
};
