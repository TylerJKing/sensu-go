import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import ClearSilenceAction from "/client/component/partial/ClearSilenceAction";
import DeleteMenuItem from "/client/component/partial/ToolbarMenuItems/Delete";
import SilenceMenuItem from "/client/component/partial/ToolbarMenuItems/Silence";
import Toolbar from "/client/component/partial/Toolbar";
import ToolbarMenu from "/client/component/partial/ToolbarMenu";
import UnsilenceMenuItem from "/client/component/partial/ToolbarMenuItems/Unsilence";

import DeleteAction from "./EntityDetailsDeleteAction";
import SilenceAction from "./EntityDetailsSilenceAction";

class EntityDetailsToolbar extends React.Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    refetch: PropTypes.func.isRequired,
  };

  static fragments = {
    entity: gql`
      fragment EntityDetailsToolbar_entity on Entity {
        isSilenced

        ...EntityDetailsDeleteAction_entity
        ...EntityDetailsSilenceAction_entity
        ...ClearSilenceAction_record
      }

      ${DeleteAction.fragments.entity}
      ${SilenceAction.fragments.entity}
      ${ClearSilenceAction.fragments.record}
    `,
  };

  render() {
    const { entity, refetch } = this.props;

    return (
      <Toolbar
        right={
          <ToolbarMenu>
            <ToolbarMenu.Item
              id="silence"
              visible={entity.isSilenced ? "never" : "if-room"}
            >
              <SilenceAction entity={entity} onDone={refetch}>
                {dialog => (
                  <SilenceMenuItem
                    disabled={dialog.canOpen}
                    onClick={dialog.open}
                  />
                )}
              </SilenceAction>
            </ToolbarMenu.Item>

            <ToolbarMenu.Item
              id="unsilence"
              visible={entity.isSilenced ? "if-room" : "never"}
            >
              <ClearSilenceAction record={entity} onDone={refetch}>
                {dialog => (
                  <UnsilenceMenuItem
                    disabled={!dialog.canOpen}
                    onClick={dialog.open}
                  />
                )}
              </ClearSilenceAction>
            </ToolbarMenu.Item>

            <ToolbarMenu.Item id="delete" visible="never">
              <DeleteAction entity={entity}>
                {handler => <DeleteMenuItem onClick={handler} />}
              </DeleteAction>
            </ToolbarMenu.Item>
          </ToolbarMenu>
        }
      />
    );
  }
}

export default EntityDetailsToolbar;
