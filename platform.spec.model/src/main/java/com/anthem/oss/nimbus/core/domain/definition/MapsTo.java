/**
 * 
 */
package com.anthem.oss.nimbus.core.domain.definition;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author Soham Chakravarti
 *
 */
public class MapsTo {

	public enum Mode {
		UnMapped,
		MappedAttached,
		MappedDetached;
	}
	
	public enum State {
		External,
		Internal,
		Associated;
	}
	
	@Retention(RetentionPolicy.RUNTIME)
	@Target({ElementType.TYPE})
	@Model
	@Inherited
	public @interface Mapped {
		
	}
	
	@Retention(RetentionPolicy.RUNTIME)
	@Target({ElementType.TYPE})
	@Mapped
	public @interface Type {
		
		Class<?> value();

		/**
		 * throw exception if unmapped property is found. Defaults to silent, i.e., no exception thrown 
		 */
		boolean silent() default true;
	}
	
	@Retention(RetentionPolicy.RUNTIME)
	@Target({ElementType.FIELD})
	public @interface Path {
		
		String value() default "";
		
		boolean linked() default true;
		
		State state() default State.Internal;
		
		KeyValue[] kv() default @KeyValue(k="default",v="default");
		
		public @interface KeyValue {
			String k();
			String v();
			boolean quad() default true;
		}
	}
	
	public static Mode getMode(Path path) {
		if(path==null) return Mode.UnMapped;
		return path.linked() ? Mode.MappedAttached : Mode.MappedDetached;
	}
	
	@Path
	public static final String DEFAULT_PATH = "";
	
	public static final String DETACHED_SIMULATED_FIELD_NAME = "detachedParam";
	
//	@Retention(RetentionPolicy.RUNTIME)
//	@Target({ElementType.TYPE})
//	@Mapped
//	public @interface AssociatedEntity {
//		Path value();
//	}
	
	
	@Retention(RetentionPolicy.RUNTIME)
	@Target({ElementType.FIELD})
	public @interface Behavior {
		
		String value();	// refers to spring bean id with: domain.behavior.{value}
		// domain.fn._process.{name}
		// domain.fn._nav.{name}
		
		// canned functions
		// or extensions which are realized as spring-bean - following a common interface
			// @Behavior(fn="CONCAT", "/patient/name/firstName", "/patient/name/lastName") private Name name;
			// @Behavior(fn="MASK") private String ssn;
			// -- same as -- /../p/{domain-root}/.../_process?fn:CONCAT
		// public void handle(ExecutionContext:{CommandMsg, ExecutionModel}, Param actionParam)
	}
}
