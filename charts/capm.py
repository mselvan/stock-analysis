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
        x=portfolio['SD'],
        y=portfolio['Returns'],
        name='Portfolio',
        text=portfolio['Ticker'],
        marker=dict(size=6),
        mode='markers'
    ),
    go.Scatter(
        x=ef['x'],
        y=ef['y'],
        name="Efficient frontier",
        text="EF",
        line_shape="spline"
    )
]

fig = go.Figure(data=data)
# fig.add_shape(
#     # Line Diagonal
#     type="line",
#     x0=0,
#     y0=0.116,
#     x1=1,
#     y1=0.116,
#     line=dict(
#         color="Gray",
#         width=2,
#         dash="dash",
#     )
# )
#
# fig.add_shape(
#     # Line Diagonal
#     type="line",
#     x0=1,
#     y0=0,
#     x1=1,
#     y1=0.116,
#     line=dict(
#         color="Gray",
#         width=2,
#         dash="dash",
#     )
# )

fig.update_layout(
    xaxis=dict(
        range=[0, 0.2],
        spikemode='toaxis'
    ),
    yaxis=dict(
        range=[0, 0.2],
        spikemode='toaxis'
    ),
    height=700)

app = dash.Dash()
app.layout = html.Div([
    dcc.Graph(figure=fig)
])

app.run_server(debug=True, use_reloader=True)
