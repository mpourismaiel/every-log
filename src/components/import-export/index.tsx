import * as React from 'react';
import { Col, Button, Row } from 'reactstrap';

export interface IImportExportProps {
  handleExport: (e) => void;
  handleImport: (e) => void;
  fileInputRef: (node) => void;
}
class ImportExport extends React.PureComponent<IImportExportProps> {
  render() {
    return (
      <Row className="mx-0 export-import">
        <Col xs="auto" className="pl-0">
          <Button color="info" onClick={this.props.handleExport}>
            Export
          </Button>
        </Col>
        <Col>
          <input
            type="file"
            id="import-file"
            className="custom-file-input"
            ref={this.props.fileInputRef}
            onChange={this.props.handleImport}
          />
          <label className="custom-file-label" htmlFor="import-file">
            Choose file to import
          </label>
        </Col>
      </Row>
    );
  }
}

export default ImportExport;
