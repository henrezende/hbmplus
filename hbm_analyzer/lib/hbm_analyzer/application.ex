defmodule HbmAnalyzer.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {Plug.Cowboy,
       scheme: :http,
       plug: HbmAnalyzer.Router,
       options: [port: Application.get_env(:hbm_analyzer, :port)]},
      # {Plug.Cowboy, scheme: :http, plug: Endpoints, options: [port: port()]},
      {Mongo,
       [
         name: :mongo,
         database: Application.get_env(:hbm_analyzer, :database),
         pool_size: Application.get_env(:hbm_analyzer, :pool_size)
       ]}
    ]

    opts = [strategy: :one_for_one, name: HbmAnalyzer.Supervisor]

    Supervisor.start_link(children, opts)
  end
end
