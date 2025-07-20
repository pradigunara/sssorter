# tripleS Sorter

This project contains two main applications: a **tripleS Bias Sorter** and a **tripleS Song Sorter**. Both are designed to help fans of the K-pop group tripleS rank their favorite members and songs.

## tripleS Bias Sorter

A web-based application that allows users to rank the 24 members of the K-pop group tripleS. The sorter uses a pairwise comparison model to generate a user's bias ranking.

### Features

- **Interactive Ranking:** Users are presented with pairs of members and must choose their favorite, leading to a comprehensive ranking.
- **Responsive Design:** The application is designed to work on both desktop and mobile browsers.
- **Shareable Results:** Users can share their ranking results on social media.
- **Dark Mode:** A theme toggle allows users to switch between light and dark modes.

### Technologies Used

- **HTML, CSS, JavaScript:** The core technologies for the web application.
- **Vite:** A modern build tool that provides a fast development experience.
- **Jest:** A JavaScript testing framework used for unit testing.
- **PostCSS and Autoprefixer:** Used for CSS processing and ensuring cross-browser compatibility.

### How to Run

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
3.  **Build for production:**
    ```bash
    npm run build
    ```

## tripleS Song Sorter

A web-based application that allows users to rank their favorite tripleS songs. The sorter uses the Elo rating system to generate a user's song ranking.

### Features

- **Interactive Song Ranking:** Users are presented with pairs of songs and must choose their favorite, leading to a comprehensive ranking.
- **Music Previews:** The application includes embedded music players from Deezer and Spotify to help users make their choices.
- **Shareable Results:** Users can share their song ranking results on social media.
- **Data Fetching Scripts:** The project includes scripts to fetch song data from Spotify and Deezer, compare the catalogs, and merge the data.

### Technologies Used

- **Preact:** A fast 3kB alternative to React with the same modern API.
- **Vite:** A modern build tool that provides a fast development experience.
- **HTML, CSS, JavaScript:** The core technologies for the web application.
- **Deezer and Spotify APIs:** Used to fetch song data and provide music previews.

### How to Run

1.  **Navigate to the `sssongs` directory:**
    ```bash
    cd sssongs
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  **Build for production:**
    ```bash
    npm run build
    ```

### Scripts

The `sssongs` directory contains several scripts for managing song data:

-   `fetchSpotifySongs.js`: Fetches song data from the Spotify API.
-   `fetchDeezerSongs.js`: Fetches song data from the Deezer API.
-   `compareCatalogs.js`: Compares the song catalogs from Spotify and Deezer.
-   `mergeSongData.js`: Merges the song data from Spotify and Deezer into a single file.
-   `validateProvider.js`: Validates the provider data.
-   `setupProvider.js`: Sets up the provider data.

## Project Structure

The project is organized into two main directories:

-   **`/` (root):** Contains the tripleS Bias Sorter application.
-   **`/sssongs`:** Contains the tripleS Song Sorter application.

Each directory contains its own `package.json`, `vite.config.js`, and `index.html` files, as well as its own set of dependencies and build processes.

## Author

-   **@celdaris**

## License

This project is licensed under the MIT License.
