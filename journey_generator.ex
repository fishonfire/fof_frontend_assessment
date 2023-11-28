defmodule TcsJourneytoolWeb.JourneyGenerator do
  @moduledoc """
    Generates an svg for a TheChangeStudio journey.
  """
  @seed 12345
  @num_points 100
  @node_distance 100
  @events [4, 6, 10]
  @min_width 500
  @event_line_height 80
  @event_circle_radius 36
  @event_text_x_offset 45
  @event_text_y_offset 125
  @points []
  @draw_events []
  @max_height 800
  @is_trending_upwards false
  @curve_height 30
  @min_height 300

  def random(step) do
    x = :math.sin(@seed + step) * 100_000
    x - :math.floor(x)
  end

  def generate do
    # Height range for the points
    width = @min_width + @num_points * @node_distance
    max_height = @max_height

    # Generate random vertical points
    points = get_graph_points(width)

    # SVG container
    svg = """
      <svg id="svg-container" style="width: #{width}px; height: #{@max_height}px;">
    """
      |> generate_bottom_area(points, max_height)
      |> generate_lines(points)
      |> generate_clickable_boxes(points, max_height)

    svg <> "</svg>"
  end

  # Does not work yet.
  defp draw_event(svg, draw_events) do
    # Find new events
    new_events = Enum.filter(draw_events, fn event -> !Enum.member?(@draw_events, event) end)
    @draw_events = @draw_events ++ new_events

    # Draw event components
    draw_event_circle(svg)
    draw_event_line(svg)
    draw_event_text(svg)
  end

  defp get_graph_points(width) do
    Enum.map(0..(@num_points - 1), fn i ->
      x = (i / (@num_points - 1)) * width
      y = random(i) * (@max_height - @curve_height - @min_height + 1) + @min_height

      %{x: x, y: y}
    end)
  end


  defp generate_bottom_area(svg, points, max_height) do
    # Create an area function
    bottom_area = fn points ->
      Enum.reduce(points, "", fn %{x: x, y: y}, acc ->
        acc <> "#{x},#{y} "
      end)
    end

    # Draw the filled area under the line
    bottom_area_path = """
      <path d="M #{bottom_area.(points)}L #{Enum.at(points, -1).x},#{max_height} Z"
            class="bg-bottom"></path>
    """

    # Append the path to the SVG
    svg <> bottom_area_path
  end


  defp generate_lines(svg, points) do
    # Create a line function that curves between points
    line = line(points)
    IO.inspect(points)
    IO.inspect(line)

    # Add a 'defs' element to the SVG for defining gradients
    defs = """
      <defs>
        <linearGradient id="area-gradient" gradientTransform="rotate(67)">
          <stop offset="0%" stop-color="#10A79E"/>
          <stop offset="100%" stop-color="#1C5B88"/>
        </linearGradient>
      </defs>
    """

    # Draw the curved line
    road_line_back = """
      <path d="M #{line}"
            stroke="url(#area-gradient)"
            class="road-line-back"/>
    """

    road_line = """
      <path d="M #{line}"
            class="road-line"/>
    """


    svg <> defs <> road_line_back <> road_line
  end

  defp generate_clickable_boxes(svg, points, max_height) do
    box_width = @node_distance
    result = svg
    Enum.each(points, fn %{x: x} ->
      result <> append_link_box(x, box_width, max_height)
    end)

    result
  end

  defp append_link_box(x, box_width, max_height) do
    """
      <a onclick="onPointClicked(this)" href="#" class="red-link-box">
        <rect x="#{x - box_width / 2}" y="0" width="#{box_width}" height="#{max_height}" fill="transparent"></rect>
      </a>
    """
  end

  defp draw_event_line(svg) do
    Enum.each(@draw_events, fn event_index ->
      svg
      |> insert_event_line(event_index)
    end)
  end

  # Does not work yet.
  defp insert_event_line(svg, event_index) do
    x = @points[event_index].x
    y = @points[event_index].y - @event_line_height + @event_circle_radius

    """
      <path d="M#{x},#{y} L#{x},#{@points[event_index].y}"
            class="event-line"></path>
    """
    |> Phoenix.LiveView.Component.html_response(svg)
  end

  # Does not work yet.
  defp draw_event_circle(svg) do
    Enum.each(@draw_events, fn event_index ->
      svg
      |> insert_event_circle(event_index)
    end)
  end

  # Does not work yet.
  defp insert_event_circle(svg, event_index) do
    x = @points[event_index].x
    y = @points[event_index].y - @event_line_height

    """
      <circle cx="#{x}" cy="#{y}" r="#{@event_circle_radius}"
              class="event-circle"></circle>
    """
    |> Phoenix.LiveView.Component.html_response(svg)
  end

  # Does not work yet.
  defp draw_event_text(svg) do
    Enum.each(@draw_events, fn event_index ->
      svg
      |> append_event_text(event_index)
    end)
  end

  # Does not work yet.
  defp append_event_text(svg, event_index) do
    x = @points[event_index].x - @event_text_x_offset
    y = @points[event_index].y - @event_text_y_offset

    """
      <text x="#{x}" y="#{y}" font-family="sans-serif" font-size="14px" fill="#036974"
            class="event-text">EVENT TITLE #{@draw_events[event_index]}</text>
    """
    |> Phoenix.LiveView.Component.html_response(svg)
  end

  defp line(points) do
    Enum.reduce(points, {nil, []}, fn %{x: x, y: y}, {prev_point, acc} ->
      case prev_point do
        nil ->
          {{x, y}, acc}

        {prev_x, prev_y} ->
          new_point = {x, y}
          interpolated_points = interpolate_points({prev_x, prev_y}, new_point)
          new_acc = acc ++ interpolated_points
          {new_point, new_acc}
      end
    end)
    |> elem(1)
    |> format_points
  end

  defp interpolate_points({x1, y1}, {x2, y2}) do
    num_interpolations = 10  # Adjust the number of interpolations as needed
    t_values = for i <- 1..num_interpolations, do: i / (num_interpolations + 1)

    Enum.map(t_values, fn t ->
      t_squared = t * t
      t_cubed = t_squared * t

      x = (1 - t) * x1 + t * x2
      y = (1 - t) * y1 + t * y2

      control_x = 0.5 * (x1 + x2) - 0.5 * (x1 - x2) * :math.cos(t_cubed)
      control_y = 0.5 * (y1 + y2) - 0.5 * (y1 - y2) * :math.cos(t_cubed)

      {control_x, control_y}
    end)
  end

  defp format_points(points) do
    Enum.map_join(points, " ", fn {x, y} -> "#{x} #{y}" end)
  end
end
