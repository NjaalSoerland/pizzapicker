from requests_html import HTMLSession

URL = "https://www.pizzabakeren.no/originalpizza"

htmlSession = HTMLSession()
r = htmlSession.get(URL)

r.html.render()

pizzas = {"original": [], "tynn": [], "vegansk": [], "dessert": []}

links = r.html.absolute_links
for link in links:
    for category in pizzas.keys():
        if category in link:
            session = htmlSession.get(link)
            session.html.render()
            
            options = session.html.find(".content")
            for option in options:
                pizzas[category].append(option.text)

print(pizzas)