import React from 'react';

class Stack extends React.Component{
    constructor(props) {
        super(props);
        this.items = [];
    }

    insert(element) {
        this.items.push(element);
    }

    remove() {
        if (this.items.length === 0)
            return "UnderFlow";
        return this.items.pop();
    }

    top() {
        if (this.items.length === 0)
            return "Stack Empty";
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

export default Stack;