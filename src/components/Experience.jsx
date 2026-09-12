import * as React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Fragment } from "react";
import { Eyebrow, Display, Body, Caption } from "./Typography";
import { Section, Rule } from "./Layout";

/**
 * ExperienceList — a simple stacked work-history list: role, company,
 * period and an optional description per row. Pass `items` as
 * `[{ role, company, period, description }]`. Renders nothing if `items`
 * is empty, so an unused section never leaves a blank gap on the page.
 */
export function ExperienceList({ index, title, items = [] }) {
  if (!items.length) return null;

  return (
    <Section>
      {index && <Eyebrow>{index}</Eyebrow>}
      {title && (
        <Display size="sm" sx={{ mt: 1, maxWidth: 640 }}>
          {title}
        </Display>
      )}

      <Stack sx={{ mt: title ? 6 : 2 }}>
        {items.map((item, i) => (
          <Fragment key={i}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 0.5, md: 4 }}
              sx={{ py: 2.5 }}
            >
              <Caption sx={{ width: { md: 160 }, flexShrink: 0 }}>{item.period}</Caption>
              <Box sx={{ flexGrow: 1 }}>
                <Body sx={{ fontSize: 18, color: "inherit" }}>{item.role}</Body>
                {item.company && (
                  <Caption sx={{ display: "block", mt: 0.5 }}>{item.company}</Caption>
                )}
                {item.description && (
                  <Body sx={{ fontSize: 14, mt: 1, maxWidth: 560 }}>{item.description}</Body>
                )}
              </Box>
            </Stack>
            {i < items.length - 1 && <Rule />}
          </Fragment>
        ))}
      </Stack>
    </Section>
  );
}