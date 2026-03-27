module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}", // App Routerの場合
        "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Pages Routerの場合
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}", // srcフォルダを使用している場合
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
