import dash
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
import plotly.graph_objects as go

sml = pd.read_csv("data/sml.csv")
portfolio = pd.read_csv("data/portfolio.csv")
ef = pd.read_csv("data/ef.csv")

data = [
    go.Scatter(
        x=[0, 0.119],
        y=[0.02, 0.18],
        name="CML",
        text="CML",
        mode="lines",
        line=dict(color="Blue")
    ),
    go.Scatter(
        x=ef['x'],
        y=ef['y'],
        name="Efficient frontier",
        text="EF",
        line_shape="spline",
        mode="lines",
        line=dict(color="Red")
    )
]

for index, row in portfolio.iterrows():
    data.append(go.Scatter(
        x=[row["SD"]],
        y=[row["Returns"]],
        mode='markers',
        name=row["Ticker"],
        text=[row["Ticker"]]
    ))

fig = go.Figure(data=data)

fig.add_shape(
    type="line",
    x0=0.0601,
    y0=0,
    x1=0.0601,
    y1=0.0894,
    line=dict(
        color="Gray",
        width=1,
        dash="dash",
    )
)

fig.add_shape(
    # Line Diagonal
    type="line",
    x0=0.0601,
    y0=0.0894,
    x1=0,
    y1=0.0894,
    line=dict(
        color="Gray",
        width=1,
        dash="dash",
    )
)

fig.update_layout(
    xaxis=dict(
        range=[0, 0.14],
        spikemode='toaxis'
    ),
    yaxis=dict(
        range=[0, 0.18],
        spikemode='toaxis'
    ),
    width=1200,
    height=700)

app = dash.Dash()
app.layout = html.Div([
    dcc.Graph(figure=fig)
])

app.run_server(debug=True, use_reloader=True)
