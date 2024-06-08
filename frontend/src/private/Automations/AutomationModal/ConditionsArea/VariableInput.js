import React, { useEffect, useState } from 'react';
import '../../Automations.css';
import Select from "react-select/creatable";

/**
 * props:
 * - symbol
 * - selectedIndex
 * - indexes
 * - onAddClick
 */
function VariableInput(props) {

    const [index, setIndex] = useState({});
    const [operator, setOperator] = useState('==');
    const [variable, setVariable] = useState('');
    const [option, setOption] = useState({ label: "Type or select...", value: "" });

    useEffect(() => {
        setIndex(props.selectedIndex);
        setVariable(props.selectedIndex.example);
    }, [props.selectedIndex])

    function getOptionText(symbol, variable) {
        return variable.startsWith('WALLET_') ? `${symbol}:${variable}` : variable;
    }

    function getExpressionText() {
        const value = typeof index.example === 'string' ? `'${variable}'` : variable;
        return `${index.symbol}:${index.variable} ${operator.replace('==', '=')} ${value}`;
    }

    function onAddClick() {
        const value = typeof index.example === 'string' ? `'${variable}'` : variable;
        const condition = {
            eval: `${index.eval}${operator}${value}`,
            text: getExpressionText()
        }
        props.onAddClick({ target: { id: 'condition', value: condition } });

        setOperator('==');
        setVariable("");
    }

    function onOperatorChange(event) {
        setOperator(event.target.value);
    }

    function getValueExpression(value){
        const firstDotIndex = value.indexOf(".");
        return value.substring(firstDotIndex + 1);
    }

    function onVariableChange(option) {
        const value = option.value;
        setOption(option);

        const index = props.indexes.find(k => value.endsWith(k.variable));
        if (index && value.indexOf('WALLET_') === -1)
            setVariable(index.eval);
        else if (/[\+\-\*\/]/.test(value))
            setVariable(`(MEMORY['${props.symbol}:${value.split(".")[0]}'].${getValueExpression(value)})`);
        else
            setVariable(value);
    }

    function getVariables() {
        let options = [];
        if (props.indexes && Array.isArray(props.indexes)) {
            options = props.indexes
                .filter(i => i.eval !== index.eval)
                .map(item => {
                    return {
                        label: getOptionText(item.symbol, item.variable),
                        value: getOptionText(item.symbol, item.variable)
                    }
                })
        }

        const userId = parseInt(localStorage.getItem("id"));
        options.push({ 
            value: getOptionText(props.symbol, `LAST_ORDER_${userId}.avgPrice*1.1`),  
            label: `LAST_ORDER_${userId}.avgPrice + 10%`
        })
        options.push({ 
            value: getOptionText(props.symbol, `LAST_ORDER_${userId}.avgPrice*1.5`),  
            label: `LAST_ORDER_${userId}.avgPrice + 50%`
        })
        options.push({ 
            value: getOptionText(props.symbol, `LAST_ORDER_${userId}.avgPrice*2`),  
            label: `LAST_ORDER_${userId}.avgPrice x2`
        })

        return options;
    }

    const customStyles = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            width: "100%",
            border: 0,
            paddingRight: 5
        })
    }

    return (
        <div className="input-group input-group-merge mb-2">
            <span className="input-group-text bg-secondary">
                is
            </span>
            <select id="operator" className="form-select" onChange={onOperatorChange} value={operator}>
                {
                    typeof index.example === 'number'
                        ? (
                            <>
                                <option value=">">greater than</option>
                                <option value=">=">greater or equals</option>
                                <option value="<">less than</option>
                                <option value="<=">less or equals</option>
                            </>
                        )
                        : <></>
                }
                <option value="==">equals</option>
                <option value="!=">not equals</option>
            </select>
            <Select
                id="variable"
                className='form-control'
                value={option}
                isDisabled={false}
                styles={customStyles}
                onChange={onVariableChange}
                options={
                    props.indexes && Array.isArray(props.indexes)
                        ? getVariables()
                        : { label: "NO OPTIONS", value: "" }
                } />
            <button type="button" className="btn btn-secondary" onClick={onAddClick}>
                <svg className="icon icon-xs" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    )
}

export default VariableInput;
