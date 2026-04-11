import { Range, getTrackBackground } from "react-range";

const baseTrackColor = "#3f3f46";
const activeTrackColor = "#f4f4f5";

export const DualRangeSlider = ({ min, max, step = 1, values, onChange }) => {
  const normalizedValues = [...values].sort((left, right) => left - right);

  return (
    <div className="sumi-lib-slider">
      <Range
        values={normalizedValues}
        step={step}
        min={min}
        max={max}
        allowOverlap={false}
        onChange={(nextValues) => onChange([...nextValues].sort((left, right) => left - right))}
        renderTrack={({ props, children }) => {
          const { key, ...restProps } = props;
          return (
            <div key={key} className="sumi-lib-slider-track-wrap" {...restProps}>
              <div
                className="sumi-lib-slider-track"
                style={{
                  background: getTrackBackground({
                    values: normalizedValues,
                    colors: [baseTrackColor, activeTrackColor, baseTrackColor],
                    min,
                    max,
                  }),
                }}
              >
                {children}
              </div>
            </div>
          );
        }}
        renderThumb={({ props }) => {
          const { key, ...restProps } = props;
          return <div key={key} className="sumi-lib-slider-thumb" {...restProps} />;
        }}
      />
    </div>
  );
};

export const SingleRangeSlider = ({ min, max, step = 1, value, onChange }) => {
  const values = [value];

  return (
    <div className="sumi-lib-slider">
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={(nextValues) => onChange(nextValues[0])}
        renderTrack={({ props, children }) => {
          const { key, ...restProps } = props;
          return (
            <div key={key} className="sumi-lib-slider-track-wrap" {...restProps}>
              <div
                className="sumi-lib-slider-track"
                style={{
                  background: getTrackBackground({
                    values,
                    colors: [activeTrackColor, baseTrackColor],
                    min,
                    max,
                  }),
                }}
              >
                {children}
              </div>
            </div>
          );
        }}
        renderThumb={({ props }) => {
          const { key, ...restProps } = props;
          return <div key={key} className="sumi-lib-slider-thumb" {...restProps} />;
        }}
      />
    </div>
  );
};
