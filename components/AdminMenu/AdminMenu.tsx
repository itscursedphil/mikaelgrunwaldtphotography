import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import styled from 'styled-components';
import { space } from 'styled-system';
import AddIcon from '@material-ui/icons/Add';

const AdminMenuSection = styled.div`
  font-size: 0.8rem;
  ${() => space({ mb: 4 })}
`;

const AdminMenuSectionTitle = styled.h3`
  font-weight: normal;
  font-size: 0.8rem;
`;

const AdminMenuSectionList = styled(ListGroup).attrs({
  flush: true,
})`
  font-size: 0.8rem;
`;

const AdminMenuSectionListItem = styled(ListGroupItem).attrs({ tag: 'a' })`
  &,
  &:active,
  &:visited {
    color: black;
    text-decoration: none;
  }

  &:focus,
  &:hover {
    background-color: rgba(0, 0, 0, 0.025);
    text-decoration: none;
  }
`;

const AdminMenu: React.FC = () => {
  return (
    <nav>
      <AdminMenuSection>
        <AdminMenuSectionTitle>Pages</AdminMenuSectionTitle>
        <AdminMenuSectionList>
          <AdminMenuSectionListItem href="#">
            Portfolio
          </AdminMenuSectionListItem>
          <AdminMenuSectionListItem href="#">About</AdminMenuSectionListItem>
        </AdminMenuSectionList>
      </AdminMenuSection>
      <AdminMenuSection>
        <AdminMenuSectionTitle>Projects</AdminMenuSectionTitle>
        <AdminMenuSectionList>
          <AdminMenuSectionListItem href="#">People</AdminMenuSectionListItem>
          <AdminMenuSectionListItem href="#">Lorem</AdminMenuSectionListItem>
          <AdminMenuSectionListItem href="#">
            Morbi leo risus
          </AdminMenuSectionListItem>
          <AdminMenuSectionListItem href="#">
            Porta ac consectetur ac
          </AdminMenuSectionListItem>
          <AdminMenuSectionListItem href="#">
            <AddIcon
              style={{ width: '1rem', height: '1rem', verticalAlign: 'sub' }}
            />{' '}
            Add project
          </AdminMenuSectionListItem>
        </AdminMenuSectionList>
      </AdminMenuSection>
    </nav>
  );
};

export default AdminMenu;
