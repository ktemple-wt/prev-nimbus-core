/**
 * 
 */
package com.anthem.oss.nimbus.core.domain.model.state;

import java.io.Serializable;

import org.apache.commons.lang3.StringUtils;

import com.anthem.nimbus.platform.spec.model.dsl.binder.QuadScopedEventListener;
import com.anthem.oss.nimbus.core.domain.model.state.EntityState.Model;
import com.anthem.oss.nimbus.core.domain.model.state.internal.ExecutionEntity;
import com.anthem.oss.nimbus.core.entity.process.ProcessFlow;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Soham Chakravarti
 *
 */
@Getter @Setter
public class QuadModel<V, C> implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private ExecutionEntity<V, C>.ExModel root;
	
	@JsonIgnore transient private final Model<C> core;
	
	@JsonIgnore transient private final Model<V> view;
	
	@JsonIgnore transient private final ProcessFlow flow;
	
	@JsonIgnore transient private QuadScopedEventListener eventPublisher;
	
	public QuadModel(ExecutionEntity<V, C>.ExModel root) {
		this.root = root;
		
//		this.core = getRoot().findModelByPath("/c");
//		this.view = getRoot().findModelByPath("/v");
//		this.flow = getRoot().findModelByPath("/f");
		
		this.core = findChildModel(getRoot(), "/c");
		this.view = findChildModel(getRoot(), "/v");
		flow = new ProcessFlow();
	}
	
	@SuppressWarnings("unchecked")
	private static <T> Model<T> findChildModel(Model<?> parent, String beanPath) {
		return (Model<T>)parent.getParams().stream()
			.filter(p->StringUtils.equals(beanPath, p.getBeanPath()))
			.map(p->p.findIfNested())
			.findFirst()
			.orElse(null);
	}
	
	public Model<?> getView() {
		if(view==null)
			return core;
		
		return view;
	}
	
//	public Model<?> resolveStateAndConfig(Command cmd) {
//		return cmd.isView() ? view : core;
//	}
	
	@Override
	protected void finalize() throws Throwable {
		getRoot().getExecutionRuntime().stop();
		
		super.finalize();
	}
		
}
