import requests
import pandas as pd
import plotly.graph_objects as go

resp = requests.get('http://localhost:3000/plots?tickers[]=spy&tickers[]=msft&startDate=01/01/2008&endDate=04/18/2020')
if resp.status_code == 200:
    resp_json = resp.json()
    spyDf = pd.DataFrame(resp_json['data']['spy'])
    msftDf = pd.DataFrame(resp_json['data']['msft'])
    data = [
        go.Scatter(
            x=spyDf.date,
            y=spyDf.close,
            name="SPY"
        ),
        go.Scatter(
            x=msftDf.date,
            y=msftDf.close,
            name="MSFT"
        )
    ]
    fig = go.Figure(data=data)
    fig.show()