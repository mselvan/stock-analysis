import dash
import dash_core_components as dcc
import dash_html_components as html
import pandas as pd
import plotly.graph_objects as go

portfolio = pd.read_csv("data/portfolio.csv")
s_portfolio = pd.read_csv("data/portfolio-sector-wise.csv")
colors = ["#d90074", "#592400", "#95e639", "#0d3033", "#6559b3", "#330014", "#e50000", "#7f5940", "#398020", "#79daf2", "#440080", "#ff0044", "#d90000", "#ff8800", "#a7cc99", "#406a80", "#ee00ff", "#f2b6c6", "#7f0000", "#7f4400", "#003307", "#80c4ff", "#912699"]

data = [
    # go.Scatter(
    #     x=[0, 0.155800],
    #     y=[0.04, 0.192000],
    #     name="SML",
    #     text="SML",
    #     mode="lines",
    #     line=dict(color="Blue")
    # )
]

for index, row in portfolio.iterrows():
    data.append(go.Scatter(
        x=[row["SD"]],
        y=[row["Returns"]],
        mode='markers',
        name=row["Ticker"],
        text=[row["Ticker"]],
        line=dict(color=colors[index]),
        marker=dict(size=8)
    ))

fig = go.Figure(data=data)

# fig.add_shape(
#     type="line",
#     x0=0.07790,
#     y0=0,
#     x1=0.07790,
#     y1=0.11600,
#     line=dict(
#         color="Gray",
#         width=1,
#         dash="dash",
#     )
# )
#
# fig.add_shape(
#     type="line",
#     x0=0.07790,
#     y0=0.11600,
#     x1=0,
#     y1=0.11600,
#     line=dict(
#         color="Gray",
#         width=1,
#         dash="dash",
#     )
# )

fig.update_layout(
    title="Portfolio Stocks - Risk vs Returns",
    xaxis_title="Risk (SD)",
    yaxis_title="Returns (CAPM)",
    xaxis=dict(
        range=[0, 0.14],
        spikemode='toaxis'
    ),
    yaxis=dict(
        range=[0, 0.18],
        spikemode='toaxis'
    ),
    width=1200,
    height=700,
    plot_bgcolor="rgb(232, 232, 232)",
    legend_orientation="h"
)

app = dash.Dash()
app.layout = html.Div([
    dcc.Graph(figure=fig)
])

app.run_server(debug=True, use_reloader=True)
