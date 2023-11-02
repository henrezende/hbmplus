defmodule HbmAnalyzer.MixProject do
  use Mix.Project

  def project do
    [
      app: :hbm_analyzer,
      version: "0.1.0",
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger, :plug_cowboy],
      mod: {HbmAnalyzer.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:mongodb_driver, "~> 1.0.0"},
      {:plug_cowboy, "~> 2.6.1"},
      {:jason, "~> 1.4.1"},
      {:poolboy, "~> 1.5"}
    ]
  end
end
