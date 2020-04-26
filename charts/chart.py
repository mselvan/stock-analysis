import requests
import pandas as pd
import plotly.graph_objects as go

resp = requests.get('http://localhost:3000/plots?tickers=AAPL,AXP,BAC,GLD,SPY,MSFT,GOOGL,IEP,JPM,LUV,WORK&startDate=01/01/2008&endDate=04/18/2020')
if resp.status_code == 200:
    stocksData = resp.json()['data']
    data = []
    for key in stocksData:
        stockData = stocksData[key]
        stockDf = pd.DataFrame(stockData)
        data.append(go.Scatter(x = stockDf.date, y = stockDf.close, name = key))
    fig = go.Figure(data=data)
    fig.show()