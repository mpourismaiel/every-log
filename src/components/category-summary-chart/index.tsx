import * as React from 'react';
import { Treemap } from 'react-vis';

import { ITransaction } from '../../pages';
import { IDictionary } from '../../types';
import { toColor } from '../../utils/string';

export interface ICategorySummaryChartProps {
  transactions: IDictionary<ITransaction>;
}

export interface ICategorySummaryChartState {
  height: number;
  width: number;
}

class CategorySummaryChart extends React.Component<
  ICategorySummaryChartProps,
  ICategorySummaryChartState
> {
  state: ICategorySummaryChartState = {
    height: 300,
    width: 300,
  };

  private node: HTMLDivElement = null;

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      height: this.node.clientHeight,
      width: this.node.clientWidth,
    });
  };

  bubbleClick = label => {
    alert('Custom bubble click func');
  };

  render() {
    if (!Object.keys(this.props.transactions).length) {
      return (
        <div className="chart-container" ref={node => (this.node = node)} />
      );
    }

    const myData = {
      color: '#fff',
      children: Object.keys(this.props.transactions)
        .reduce((tmp, key) => {
          const item = this.props.transactions[key];
          let node = tmp.find(n => n.category === item.category);
          if (node) {
            node = { ...node };
            node.price = node.price + item.price;
          } else {
            tmp.push(item);
          }
          return tmp;
        }, [])
        .reduce((tmp, item) => {
          tmp.push({
            color: toColor(item.category, 2),
            size: item.price,
            title: item.category,
            style: {
              fill: '#fff',
            },
          });
          return tmp;
        }, []),
    };

    return (
      <div className="chart-container" ref={node => (this.node = node)}>
        <Treemap
          hideRootNode
          animation={{ damping: 9, stiffness: 300 }}
          className="nested-tree-example"
          colorType="literal"
          data={myData}
          mode="circlePack"
          renderMode="DOM"
          height={this.state.height}
          width={this.state.width}
          getSize={d => d.size}
          getColor={d => d.color}
          style={{
            strokeWidth: '0.25',
            strokeOpacity: 1,
          }}
        />
      </div>
    );
  }
}

export default CategorySummaryChart;
