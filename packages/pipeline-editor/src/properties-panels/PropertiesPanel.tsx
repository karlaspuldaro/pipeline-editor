/*
 * Copyright 2018-2021 Elyra Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useRef } from "react";

import { CommonProperties, PropertyDefinitions } from "@elyra/canvas";
import styled from "styled-components";

import * as controls from "../CustomFormControls";
import { fillPropertiesWithSavedData } from "./properties-utils";
import useActiveFormItemShim from "./useActiveFormItemShim";

interface Props {
  refs?: {
    filehandler?: string;
  };
  currentProperties: any;
  propertiesSchema: PropertyDefinitions;
  onFileRequested?: (options: any) => any;
  onPropertiesUpdateRequested?: (options: any) => any;
  onChange?: (data: any) => any;
  id?: string;
}

export const Message = styled.div`
  margin-top: 14px;
  padding: 0 22px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: ${({ theme }) => theme.typography.fontSize};
  color: ${({ theme }) => theme.palette.text.primary};
  opacity: 0.5;
`;

export function PropertiesPanel({
  refs,
  currentProperties,
  propertiesSchema,
  onFileRequested,
  onPropertiesUpdateRequested,
  onChange,
  id,
}: Props) {
  useActiveFormItemShim();

  const controller = useRef<any>();

  // always be validating
  useEffect(() => {
    if (controller.current !== undefined) {
      controller.current.validatePropertiesValues();
    }
  });

  return (
    <CommonProperties
      key={id}
      propertiesInfo={{
        parameterDef: fillPropertiesWithSavedData(
          propertiesSchema,
          currentProperties
        ),
        labelEditable: false,
      }}
      propertiesConfig={{
        containerType: "Custom",
        rightFlyout: false,
      }}
      callbacks={{
        actionHandler: async (id: string, _appData: any, data: any) => {
          const propertyValues = controller.current.getPropertyValues();

          let filename;
          if (refs?.filehandler) {
            filename = propertyValues[`elyra_${refs?.filehandler}`];
          }

          switch (id) {
            case "browse_file":
              return await onFileRequested?.({
                // data are the parameters passed by the call to handler
                // NOT properties data
                ...data,
                filename,
              });
            case "refresh_properties":
              return await onPropertiesUpdateRequested?.(propertyValues);
          }
        },
        controllerHandler: (e: any) => {
          controller.current = e;
        },
        propertyListener: (e: any) => {
          if (e.action === "UPDATE_PROPERTY") {
            onChange?.(controller.current.getPropertyValues());
          }
        },
      }}
      customControls={Object.values(controls)}
    />
  );
}
