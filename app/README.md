# Frontend Code Test


## Requirements

Using the provided JSON data representing a collection of meal recipes, create a micro frontend application that meets the following criteria:

* Display a list (or table) of recipes.
* Allow filtering of recipes by a single ingredient.
* Add checkboxes to allow selection of multiple recipes.
* Show an alphabetically ordered list of distinct ingredients for the selected recipes. This should update as recipes are selected / unselected.
* Persist the selections locally and regenerate the view on page refresh.
* In a README note any required setup to be able to run the app, such as modifying hosts file, etc.

## Execute the app

Just open the index.html file in your browser.

Notice that when opening as a local file app (file://...), Chrome is not allowing to load the JSON data file, and a cross origin request error is displayed on the console.

Please, open it using Firefox.

## How I did?

This is a jQuery based app.
I used jQuery [DataTables](https://datatables.net/).
jQuery DataTables gives you advanced table features, so searching content, sorting, selecting rows... will be easy to implement.
