from requests_html import HTMLSession

URL = "https://www.pizzabakeren.no/originalpizza"

htmlSession = HTMLSession()
r = htmlSession.get(URL)

r.html.render()

links = r.html.absolute_links
for link in links:
    for category in ["original", "tynn", "vegansk", "dessert"]:
        if category in link:
            print("Options")
            session = htmlSession.get(link)
            session.html.render()


            pizzas = session.html.find(".content")
            for pizza in pizzas:
                print(pizza.text)