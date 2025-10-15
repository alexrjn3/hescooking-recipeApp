A web application for searching recipes, built using vanilla JavaScript and the MVC architecture. The user can type a recipe name into the search bar, and results are fetched from an external API.
The app also provides recipe recommendations based on previous searches, allows the user to download the selected recipe as a JPG (including its ingredients for convenient shopping), and maintains a search history.

This application was originally developed as part of a course I followed, but I added several improvements to enhance its functionality:
- Implemented search history saving using localStorage. The previous searches are displayed on the home page, along with a “Delete History” button.
- Added a “Download Recipe” button that generates a JPG image containing the selected recipe and its ingredients — making it more convenient to shop for what’s needed.
- Implemented a recommendation system based on past searches.
- I created a menu system that allows adding future pages/features.
- All the new features were implemented while continuing to follow the MVC architecture.

Recommendation system based on past searches:
1. If the user has viewed recipes with similar titles (e.g., “Chicken Curry”, “Chicken Soup”, “Rice with Chicken”), the app extracts the most frequent words (in this case: “Chicken”, “Rice”) and automatically searches for new recipes containing those words.
2, For every search and recipe view, the data is stored in localStorage.
3. The state.recommend structure is implemented as a Set, where keywords from recipe titles are stored. At the same time, a frequency array tracks how often each keyword appears.
4. The app selects the top two most frequent keywords (excluding filler words like “best”, “with”, “&”) and uses them to query the API.
5. The results display six recommended recipes (three for each keyword).

The underlying algorithm follows a simplified Bag-of-Words approach.
