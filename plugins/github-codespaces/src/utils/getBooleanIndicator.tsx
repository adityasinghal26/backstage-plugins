/*
 * Copyright 2023 The Kubin Kloud Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { StatusError, StatusOK } from '@backstage/core-components';
import React from 'react';

/**
 * Method to create an indicator that gives -
 * green dot paired with text 'True'
 * red dot paired with text 'False'
 * @param props - Properties with the boolean status
 * @returns a green/red dot icon with the status text
 */
export const booleanIndicator = (props: { status?: boolean }) => {
  return (
    <>
      <BooleanIcon {...props} />
      {getBooleanDescription(props)}
    </>
  );
};

/**
 * Gives a dot icon on different boolean status
 * @param status for boolean status
 * @returns a green/red indicator for the boolean
 */
export function BooleanIcon({ status }: { status?: boolean }) {
  if (status === undefined) return null;
  if (status) return <StatusOK />;
  return <StatusError />;
}

/**
 * Gives the text output on different boolean status
 * @param status for boolean status
 * @returns a True/False text for the boolean
 */
export function getBooleanDescription({ status }: { status?: boolean }) {
  if (status === undefined) return null;
  if (status) return 'True';
  return 'False';
}
