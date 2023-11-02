defmodule HbmAnalyzer.JSONUtils do
  @moduledoc """
  JSON Utilities
  """

  @doc """
  Extend BSON to encode MongoDB ObjectIds to string
  """
  # Defining a implementation for the Jason.Encode for BSON.ObjectId
  defimpl Jason.Encoder, for: BSON.ObjectId do
    def encode(id, options) do
      BSON.ObjectId.encode!(id)
      |> Jason.Encoder.encode(options)
    end
  end

  def normaliseMongoId(doc) do
    doc
    |> Map.put('id', doc["_id"])
    |> Map.delete("_id")
  end
end
