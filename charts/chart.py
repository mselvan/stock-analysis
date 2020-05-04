import requests
import pandas as pd
import plotly.graph_objects as go
import dash
import dash_core_components as dcc
import dash_html_components as html

def percentageChange(fromNum, toNum):
    return (fromNum - toNum) / toNum

#resp = requests.get('http://localhost:3000/plots?tickers=AAPL,AXP,BAC,GLD,SPY,MSFT,GOOGL,IEP,JPM,LUV,WORK&startDate=01/01/2008&endDate=04/18/2020&lowHigh=quarter')
resp = requests.get('http://localhost:3000/plots?tickers=SPY&startDate=01/01/2005&endDate=04/18/2020&lowHigh=quarter')
if resp.status_code != 200:
    exit(0)

stocksData = resp.json()['data']
data = []
for key in stocksData:
    stockData = stocksData[key]
    stockDf = pd.DataFrame(stockData)
    data.append(
        go.Bar(
            x = stockDf.date,
            y = percentageChange(stockDf.quarter_high, stockDf.close),
            name = key + " - Potential to grow",
            hovertemplate =
            '<i>Close</i>: $%{text}',
            text = stockDf.close,
            marker_color = "Green"
        )
    )
    data.append(
        go.Bar(
            x = stockDf.date,
            y = percentageChange(stockDf.close, stockDf.quarter_low),
            name = key + " - Grown since",
            hovertemplate =
            '<i>Close</i>: $%{text}',
            text = stockDf.close,
            marker_color = "Orange"
        )
    )
    data.append(
        go.Bar(
            x = stockDf.date,
            y = percentageChange(stockDf.close, stockDf.quarter_high),
            name = key + " - Dropped from",
            hovertemplate =
            '<i>Close</i>: $%{text}',
            text = stockDf.close,
            marker_color = "Red"
        )
    )
fig = go.Figure(data=data)

fig.update_layout(
    title="SPY - with Quarterly High/Low reference",
    yaxis= dict(
        tickformat = ',.0%'
    ),
    barmode='group',
    width=1200,
    height=700,
    plot_bgcolor="rgb(245, 245, 245)"
)
app = dash.Dash()
app.layout = html.Div([
    dcc.Graph(figure=fig)
])

app.run_server(debug=True, use_reloader=True)
